import "leaflet/dist/leaflet.css"
import "./Mapa.css"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useEffect, useState } from "react";


export default function Mapa(){
    const centroInicial = [-22.913633, -47.000000]
    const [posicao, setPosicao] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        // Condição pra saber se o navegador tem geolocalização
        if(!("geolocation" in navigator)){
            setError("Navegador não tem suporte para navegação.")
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setPosicao({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });
            },

            // Error function
            () => {
                setError("Não foi possível obter sua localização.");
            },

            // Set properties
            {
                enableHighAccuracy: true,
                timeout: 8000,
                maximumAge: 0,
            }
        );
    }, []);

    const zoomInicial = posicao ? 15 : 13;

    return(
        <section className="mapa">
            <h2>Mapa</h2>
            <p>Verifique onde você está no mapa</p>

            {error && <div>{error}</div>}

            <MapContainer
                center={posicao ? [posicao.lat, posicao.lng] : centroInicial}
                zoom={zoomInicial}
                scrollWheelZoom={true}
                className="mapaContainer"
            >
                <TileLayer
                    attribuition="&copy; OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {posicao && (
                    <Marker
                        position={[posicao.lat, posicao.lng]}
                    >
                        <Popup>Você está aqui! :D</Popup>
                    </Marker>
                )}
                
            </MapContainer>
        </section>
    );
};