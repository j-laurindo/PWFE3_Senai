import BotaoIcone from "../BotaoIcone.jsx/BotaoIcone";
 
export default function GridIcones({
    questao,
    onOpen,
    modalOpen,
    trancadaIndex,
    resolvidas
}) {
 
    return (
        <section aria-hidden={modalOpen || undefined}
        inert={modalOpen ? "" : undefined}>
            <ul>
                {questao.map((q, idx) => {
                    const locked = idx > trancadaIndex;
                    const resolvida = resolvidas.has(q.id)
                    return (
                        <BotaoIcone key={q.id}
                        questao={q}
                        onOpen={onOpen}
                        locked={locked}
                        resolvida={resolvida} />
                    )
                })}
            </ul>
        </section>
    )
 
}
 