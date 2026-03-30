import { useEffect, useId, useRef, useState } from "react";

export default function QuestionDialog(
    questoes,
    index,
    total,
    onClose,
    onCorrect
){
   
    const titleId = useId();
    const dialogRef = useRef(null);
    const closeBrnRef = useRef(null);
    const prevFocused = useRef(null);

    const [resposta, setResposta] = useState("");
    const [feedback, setFeedback] = useState({type: "info", msg: ""});
    const [isCorrect, setIsCorrect] = useState(false);

    const normalize = (s) => 
        (s ?? "")
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036F]/g,"")
        .replace(/[.,;:!?()\"'`´^~]/g, "")
        .trim()
        .toLowerCase()
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const user = normalize(resposta);
        const ok = (questoes.correto || []).some(
            (corr) => normalize(corr) === user
        );

        if(ok){
            setIsCorrect(true)
            setFeedback({type: "success", msg: "Resposta Correta! :D \nPróxima charada liberada"})
        } else {
            setIsCorrect(false)
            setFeedback({type: "error", msg: "Você errou!!!! Tente Novamente, se for capaz"})
        }
    }

    useEffect(() => {
        prevFocused.current = document.activeElement
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeBrnRef.current?.focus();

        const onKey = (e) => {
            if (e.key === "Escape") onClose()
        }

        window.addEventListener("keydown", onKey)
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener("keydown", onKey)

            if(prevFocused.current instanceof HTMLElement) prevFocused.current.focus()
        }
    }, [onClose])
    
    
    return(
        <div 
            id={`dialog-${questoes.id}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="dialog"
            ref={dialogRef}
        >    
            <header>
                <h2 id={titleId} className="dialog-tittle">
                    {questoes.titulo}
                </h2>
                <p className="dialog-subtitle">
                    Pergunta: {index + 1} de {total}
                </p>
                <button
                    ref={closeBrnRef}
                    type="button"
                    className="dialog-close"
                    aria-label={`Fechar pergunta: ${questoes.titulo}`}
                    onClick={onClose}
                >
                    Fechar
                </button>
                <section className="dialog-content">
                    <div className="dialog-card">
                        <h3 className="dialog-prompt">{questoes.prompt}</h3>
                        <form className="question-form" onSubmit={handleSubmit}>
                            <label htmlFor="resposta" className="question-label">
                                Sua Resposta:
                            </label>
                            <input
                                id="Resposta"
                                className="question-input"
                                type="text"
                                autoComplete="off"
                                aria-describedby="feedback"
                                aria-invalid={feedback.type === "error" ? "true" : "false"}
                                value={resposta}
                                onChange={(e) => setResposta(e.target.value)}
                                disabled={isCorrect}
                                placeholder="Escreva sua resposta"
                            />

                            <div 
                                id="feedback" 
                                className={`question-feedback question-feedback--${feedback.type}`}
                            >
                                {feedback.msg}
                            </div>

                            {isCorrect ? (
                                <div className="question-actions">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                    >
                                        Confirmar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={onClose}
                                    >
                                        Voltar
                                    </button>
                                </div>
                            ) : (
                                <div className="question-actions">
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={() => {
                                            onCorrect(questoes.id)
                                            onClose
                                        }}
                                        aria-label="Avançar para a próxima pergunta"
                                    >
                                        Avançar
                                    </button>
                                </div>
                            )}
                        </form>

                        {questoes.dica && 
                        <p className="question-hint">
                            Dica: {questoes.dica}
                        </p>}
                        
                    </div>
                </section>
            </header>
        </div>
    );
}