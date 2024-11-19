import { useNavigate } from "react-router-dom"

export default function Modal({message}){
    const navigate = useNavigate()

    const handleRedirect = ()=>{
        navigate('/');
        window.location.reload();
    }

    return(
        <>
            <div className="modal z-50">
                <div className="overlay">
                    <div className="modal-content flex flex-col gap-y-4">
                        <h1 className="text-center">{message}</h1>
                        <button className="text-base rounded-md border-2 border-black py-2 decoration-solid hover:underline"
                        onClick={()=>handleRedirect()}>
                            Continuar
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}