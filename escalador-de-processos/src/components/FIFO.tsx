import React, { useState } from 'react';

type Processo = {
    chegada: number;
    duracao: number;
    deadline?: number;
    codigo: number;
    originalIndex?: number;
}

type Props = {
    linhas: number;
    tabela: Processo[];
};

const FIFO = ({ linhas, tabela }: Props) => {
    const NUM_LINHAS = linhas;

    const originalIndex = tabela.map((processo, index) => ({ ...processo, originalIndex: index })); 
    const sortedTabela = originalIndex.slice().sort((a, b) => { 
        if (a.chegada === b.chegada) {
            return a.codigo - b.codigo;
        }
        return a.chegada - b.chegada;
    });
    const createGridItems = () => {
        const items = []; 
        const statusGrid: string[][] = Array(NUM_LINHAS).fill(null).map(() => []); 
        let processoTerminou = 0; 
        let numColunas = 0; 

        sortedTabela.forEach((processo) => {
            const startRow = processo.originalIndex; 
            const startCol = Math.max(processo.chegada, processoTerminou); 

            for (let col = startCol; col < startCol + processo.duracao; col++) { 
                statusGrid[startRow][col] = 'green'; 
            }

            for (let col = processo.chegada; col < startCol; col++) {
                    statusGrid[startRow][col] = 'yellow'; 
            }

            processoTerminou = startCol + processo.duracao; 
            numColunas = Math.max(numColunas, processoTerminou); 
        });

        for (let row = 0; row < NUM_LINHAS; row++) {
            for (let col = 0; col < numColunas; col++) {
                const status = statusGrid[row][col];
                items.push(
                    <div
                        key={`${row}-${col}`}
                        className={`flex items-center justify-center border border-black border-opacity-40 w-10 h-10 ${status === 'green' ? 'bg-green-500' : (status === 'yellow' ? 'bg-yellow-500' : 'bg-white')}`}
                    >
                    </div>
                );
            }
        }

        return { items, numColunas, statusGrid };
    };

    const { items, numColunas, statusGrid } = createGridItems();

    const calculateTurnaroundTime = () => {
        let nonWhiteCells = 0;

        for (let row = 0; row < NUM_LINHAS; row++) {
            for (let col = 0; col < numColunas; col++) {
                if (statusGrid[row][col] !== undefined ) {
                    nonWhiteCells++;
                }
            }
        }

        return nonWhiteCells / linhas;
    };

    const turnaroundTime = calculateTurnaroundTime();

    const [isDetailVisible, setIsDetailVisible] = useState(false);

    function handleDetailVisibility() {
        setIsDetailVisible(!isDetailVisible);
    }

    return (
        <div className="flex flex-col items-center bg-gray-100 p-4 rounded-3xl">
            <button onClick={handleDetailVisibility} className='text-blue-800 font-semibold py-1 px-3 mb-4 rounded-lg'>{isDetailVisible ? "Esconder detalhes" : "Mostrar detalhes"}</button>
            {isDetailVisible ? (
                <div className="mb-4 -mt-2">
                    <h3 className="text-lg font-extrabold mt-2 mb-2">Tabela de Processos Ordenada:</h3>
                    <ul>
                        {originalIndex.map(processo => (
                            <li key={processo.codigo} className="flex gap-3 mb-2">
                                <span>{`Código: ${processo.codigo}`}</span>
                                <span>{` Chegada: ${processo.chegada}`}</span>
                                <span>{` Duração: ${processo.duracao}`}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                ""
            )}

            <div
                className="grid gap-0"
                style={{
                    gridTemplateColumns: `repeat(${numColunas}, 1fr)`,
                    gridTemplateRows: `repeat(${NUM_LINHAS}, 1fr)`,
                }
            }
            >
                {items}
            </div>

            <div className="mt-4">
                <h4 className="text-lg font-extrabold">Turnaround:</h4>
                
                <p>{turnaroundTime.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default FIFO;
