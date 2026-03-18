import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect, useState, useRef } from 'react'
import './Mapa.css'
import L from "leaflet"
import iconUrl from "leaflet/dist/images/marker-icon.png"
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png"
import shadowUrl from "leaflet/dist/images/marker-shadow.png"
 
const defaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    shadowSize: [41, 41]
})
 
L.Marker.prototype.options.icon = defaultIcon;
 
function Mapinha() {
 
    const centroInicial = [-22.913633, -41.000000];
    const local = [-22.9138845, - 47.0650954];
 
    // const centroInicial = [-22.91374122998046, -47.06761664801084]
    const [posicao, setPosicao] = useState(null);
    const [erro, setErro] = useState("");
 
    const idRef = useRef(1);
 
    const [pontos, setPontos] = useState([]);
 
    function calculaDistancia(alvo, origem){
        if(!origem) return null;
 
        const a = L.latLng(-22.9138845, - 47.0650954);
        const b = L.latLng(alvo.lat, alvo.lng);
 
        return a.distanceTo(b);
    }
 
    useEffect(() => {
        if (!("geolocation" in navigator)) {
            setErro("Navegador não tem suporte para navegação")
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setPosicao({ lat: pos.coords.latitude, lng: pos.coords.longitude })
            },
            () => {
                setErro("Não foi possível obter a localização")
            },
            {
                enableHighAccuracy: true,
                timeout: 8000,
                maximumAge: 0,
            }
        );
    }, []);
 
    function adicionaPonto({lat, lng}){
        const novo = {
            id: idRef.current++,
            lat,
            lng,
            distanciaM: calculaDistancia({lat, lng}, local),
        };
        setPontos((prev) => [...prev, novo]);
    }
 
    function limpaPontos(){
        setPontos([]);
        idRef.current = 1;
    }
 
    const zoomInicial = posicao ? 15 : 13;
 
    function ClickHandler({onAdd}){
        useMapEvents({
            click(e){
                const {lat, lng} = e.latlng
                onAdd({lat, lng})
            },
        })
        return null;
    }
 
    return (
        <section className="mapa">
            <h2>Mapa</h2>
            <p>Onde você está?</p>
            {erro && <div>{erro}</div>}
 
            <section className="painel">
                <div className="painel-topo">
                    <h3>Pontos adicionados</h3>
                    <button className="botao" onClick={limpaPontos}>Apagar pontos</button>
                </div>
 
                {pontos.length === 0? (
                    <p className="vazio"> Nenhum ponto ainda. Clique para adicionar</p>
                ): (
                    <ul className="lista-pontinhos">
                        {pontos.map((p) => (
                            <li key={p.id} className="pontinho">
                                <span>#{p.id}</span>
                                <span>
                                    {p.lat}, {p.lng}
                                </span>
                                <span className="distancia">
                                    {p.distanciaM}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
 
            <MapContainer
                center={posicao ? [posicao.lat, posicao.lng] : centroInicial}
                zoom={zoomInicial}
                scrollWheelZoom={true}
                className="mapinha">
 
                    <TileLayer
                    attribution="&copy; OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
 
                    {posicao && (
                        <Marker
                        position={local}
                        icon = {defaultIcon}>
 
                            <Popup>Você está aqui</Popup>
 
                        </Marker>
                    )}
 
                    {pontos.map((p) => (
                        <Marker key={p.id} position={[p.lat, p.lng]}>
                            <Popup>
                                <div>
                                    <span>Pontos #{p.id}</span>
                                    <span>Distância: {p.distanciaM}</span>
                                </div>
                            </Popup>
                        </Marker>  
                    ))}
 
                    <ClickHandler onAdd={adicionaPonto} />
 
            </MapContainer>
        </section>
    )
 
}
export default Mapinha