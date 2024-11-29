import { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import { collection, addDoc, onSnapshot, doc, setDoc, getDoc } from "firebase/firestore";
import './ChatEstilo.css'; 

const ChatEstilo = () => {
    const [mensajes, setMensajes] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState("");
    const [nombre, setNombre] = useState("");
    const [usuarioValido, setUsuarioValido] = useState(false);
    const [alertaActiva, setAlertaActiva] = useState(false); 

    const manejarNombre = (e) => {
        setNombre(e.target.value);
    }

    const ingresarChat = (e) => {
        e.preventDefault();
        if (nombre.trim()) {
            setUsuarioValido(true);
        }
    }

    
    useEffect(() => {
        const escuchador = onSnapshot(collection(db, "mensajes"), (snapshot) => {
            const datosMensajes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const mensajesOrdenados = datosMensajes.sort((a, b) => a.timestamp - b.timestamp);
            setMensajes(mensajesOrdenados);
        });

        const alertaRef = doc(db, "alerta", "estado");
        const alertaEscuchador = onSnapshot(alertaRef, (doc) => {
            const alertaData = doc.data();
            if (alertaData) {
                setAlertaActiva(alertaData.activo);
            }
        });

        return () => {
            escuchador();
            alertaEscuchador();
        };
    }, []);

    const enviarMensaje = async (event, mensajeTexto) => {
        event.preventDefault();
        if (mensajeTexto.trim()) {
            await addDoc(collection(db, "mensajes"), {
                text: mensajeTexto,
                usuario: nombre,
                timestamp: new Date()
            });
            setNuevoMensaje("");
        }
    }

    const enviarAlertaAccidente = async (event) => {
        event.preventDefault();
        enviarMensaje(event, "¡Alguien tuvo un accidente! 🚑🚨");

        const alertaRef = doc(db, "alerta", "estado");
        await setDoc(alertaRef, { activo: true });

    }

    const cerrarAlerta = async () => {
        const alertaRef = doc(db, "alerta", "estado");
        await setDoc(alertaRef, { activo: false });
    }

    return (
        <div className={`chat-container ${alertaActiva ? "alerta" : ""}`}>
            {!usuarioValido ? (
                <form onSubmit={ingresarChat} className="nombre-form">
                    <h1>Chat Comunitario</h1>
                    <input type="text" value={nombre} onChange={manejarNombre} placeholder="Ingresa tu nombre..." required />
                    <button type="submit">Enviar</button>
                </form>
            ) : (
                <>
                    <h1>Chat Comunitario</h1>
                    <div className="mensajes-container">
                        {mensajes.map(mensaje => (
                            <div key={mensaje.id} className="mensaje">
                                <strong>{mensaje.usuario} dice:</strong>
                                {mensaje.text}
                            </div>
                        ))}
                    </div>
                    <form onSubmit={(e) => enviarMensaje(e, nuevoMensaje)}>
                        <input
                            type="text"
                            value={nuevoMensaje}
                            onChange={(e) => setNuevoMensaje(e.target.value)}
                            placeholder="Escribe un mensaje..."
                            required
                        />
                        <button type="submit">Enviar</button>
                    </form>

                   
                    <button className="alerta-btn" onClick={enviarAlertaAccidente}>
                        <span role="img" aria-label="curita">🩹</span> Alerta de accidente
                    </button>
                </>
            )}

            {alertaActiva && (
                <div className="alerta-screen">
                    <div className="alerta-icono">
                        <span role="img" aria-label="accidente">🚑</span>
                        <p>¡ALERTA DE ACCIDENTE!</p>
                        <button onClick={cerrarAlerta}>Cerrar Alerta</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatEstilo;
