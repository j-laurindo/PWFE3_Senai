import { useMemo, useState } from "react"
import questoes from '../../../public/data/questoes.json';
import GridIcones from "../../components/GridIcones/GridIcones";

export default function QuestoesTela(){
    const [selecionada, setSelecionada] = useState(null);
    const [trancadaIndex, setTrancadaIndex] = useState(0);
    const [resolvidas, setResolvidas] = useState(() => new Set());

    const total = questoes.length;

    const handleOpen = (q) => setSelecionada(q);
    const handleClose = () => setSelecionada(null);

    const progress = useMemo(() => {
        const solucao = resolvidas.size;
        return {solucao, total, percent: Math.round((solucao / total) * 100)};
    }, [resolvidas, total]);

    const handleCorrect = (id) => {
        setResolvidas((prev) => {
            const next = new Set(prev)
            next.add(id);
            return next
        });
        const idx = questoes.findIndex((q) => q.id === id);
        if (idx > -1 && idx < questoes.length -1) {
            setTrancadaIndex((prev) => Math.max(prev, idx +1))
        }
    }

    return (
        <>
            <main>
                <header>
                    <h1>Gravity Falls - Caça ao Tivô-Stan</h1>
                    <p>Clique no ícone para responder a pergunta</p>
                    <section className="progress">
                        <div 
                            className="progress-bar"
                            style={{width: `${progress.percent}`}}
                            role="progressbar"
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`Progresso: ${progress.solucao} de ${progress.total} resolvidas`}
                        />
                        <span className="progress-label">{progress.solucao}/{progress.total}</span>
                    </section>
                </header>
                <GridIcones 
                    questao = {questoes}
                    onOpen = {handleOpen}
                    modalOpen = {Boolean(selecionada)}
                    trancadaIndex ={trancadaIndex}
                    resolvidas = {resolvidas}
                />
                {selecionada && (
                    <QuestionDialog 
                        questoes = {selecionada}
                        index = {questoes.findIndex((q) => q.id === selecionada.id)}
                        total = {total}
                        onClose = {handleClose}
                        onCorrect = {handleCorrect}
                    />
                )}
            </main>
        </>
    )
}