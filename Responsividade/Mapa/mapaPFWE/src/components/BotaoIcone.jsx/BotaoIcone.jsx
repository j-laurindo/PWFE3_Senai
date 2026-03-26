export default function BotaoIcone (questao, onOpen, locked, resolvida){
    
    const dialogId = `dialog-${questao.id}`
    const baseIcon = questao.icon ?? "star.png"
    const icon = locked ? "lock.svg" : resolvida ? "check.svg" : baseIcon

    const aria = locked 
    ? `${questao.titulo} (bloqueada, resolva a anterior)`
    : resolvida
    ? `${questao.titulo} (resolvida)`
    : `${questao.titulo} (disponivel)`;
    
    return(
        <li className="icon-grid-item">
            <button
                type="button"
                className={`icon-button${locked ? " icon-button--locked" : ""} 
                ${resolvida ? " icon-button--resolvida" : ""}`}
                aria-haspopup="dialog"
                aria-controls={dialogId}
                aria-label={aria}
                onClick={() => onOpen(questao)}
                disabled={locked}
                aria-disabled={locked || undefined}    
            >
                <img src={icon} className="icon-button-img" aria-hidden="true" alt={`Essa imagem é um ícone: ${icon}`}/>
                <span className="visually-hidden">{questao.titulo}</span>
            </button>
        </li>
    )
}