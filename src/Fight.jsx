import "./App.css";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import enemyData from './data/enemy.json'
import Modal from "./Modal";

export default function Fight(){
    const speeds = {
        paused:150,
        slow:120,
        normal:70,
        fast:40
    }
    const dialogs = [
        { string: "¡Bienvenido! El combate está por comenzar", speed: speeds.normal },
        { string: "¿Qué debería hacer?", speed: speeds.normal },
        { string: " utilizó ", speed: speeds.normal },
        { string: "¡Es muy efectivo!", speed: speeds.fast },
        { string: "No es muy efectivo...", speed: speeds.paused },
        { string: " se ha debilitado!", speed: speeds.slow },
        { string: " se ha debilitado...", speed: speeds.paused },
        { string: " es tu turno!", speed: speeds.fast},
        { string: "El rival ha enviado a ", speed: speeds.fast},
    ]
    const location = useLocation();
    const [playerTeam, setPlayerTeam] = useState(location.state?.pokemonTeam);
    const [enemyTeam, setEnemyTeam] = useState(enemyData.pokemon)
    const [currentPkmn, setCurrent] = useState(0);
    const [currentEnemy, setEnemy] = useState(0);
    const [availablePkmn, setAvailable] = useState([1,1,1]);
    const [currentDialog, setDialog] = useState(dialogs[1].string)
    const [currentSection, setSection] = useState(0);
    const [allyStatus, setAllyStatus] = useState(0);
    const [enemyStatus, setEnemyStatus] = useState(0);
    const [turn, setTurn] = useState(0);
    const [playerTurn, setPlayerTurn] = useState(true);
    const [gameRunning, setGameRunning] = useState(true);
    const [endStatus, setEndStatus] = useState('')

    const handleGameOver = (message) => {
        setGameRunning(false)
        setEndStatus(`${message}`)
    }

    const dealDmg = (movimiento) => {
        setTurn(turn+1)
        setPlayerTurn(false)
        const updatedEnemyTeam = [...enemyTeam];
        if(updatedEnemyTeam[currentEnemy].debilidades.includes(movimiento["tipoDaño"])){
            updatedEnemyTeam[currentEnemy].HP = Math.max(0, updatedEnemyTeam[currentEnemy].HP - movimiento["daño"]*2);
            console.log("Debilidad");
        } else if(updatedEnemyTeam[currentEnemy].resistencias.includes(movimiento["tipoDaño"])){
            updatedEnemyTeam[currentEnemy].HP = Math.max(0, updatedEnemyTeam[currentEnemy].HP - movimiento["daño"]/2);
            console.log("Resistencia");
        } else {
            updatedEnemyTeam[currentEnemy].HP = Math.max(0, updatedEnemyTeam[currentEnemy].HP - movimiento["daño"]);
        }
        setEnemyTeam(updatedEnemyTeam);
        setSection(3);
        setDialog(`${playerTeam[currentPkmn]['nombre']}${dialogs[2].string}${movimiento['nombre']}`);
        if(enemyTeam[currentEnemy].HP == 0){
            setTimeout(()=>{
                setDialog(`${enemyTeam[currentEnemy].nombre}${dialogs[5].string}`)
                if(currentEnemy+1 >= enemyTeam.length){
                    handleGameOver("¡Victoria!")
                } else{
                    setEnemy(currentEnemy+1)
                }
            }, 1500)
        } else{
            setTimeout(()=>{
                takeTurn()
            }, 1500);
        }
    }

    const takeTurn = () => {
        const action = Math.floor(Math.random() * 4);
        const movimiento = enemyTeam[currentEnemy]['movimientos'][action];
        const updatedPlayerTeam = [...playerTeam];
    
        if (updatedPlayerTeam[currentPkmn]["debilidades"].map(d => d.toLowerCase()).includes(movimiento.tipoDaño.toLowerCase())) {
            updatedPlayerTeam[currentPkmn]['HP'] = Math.max(0, updatedPlayerTeam[currentPkmn]['HP'] - movimiento.daño * 2);
            console.log("Debilidad");
        } else if (updatedPlayerTeam[currentPkmn]["resistencias"].map(r => r.toLowerCase()).includes(movimiento.tipoDaño.toLowerCase())) {
            updatedPlayerTeam[currentPkmn]['HP'] = Math.max(0, updatedPlayerTeam[currentPkmn]['HP'] - movimiento.daño / 2);
            console.log("Resistencia");
        } else {
            updatedPlayerTeam[currentPkmn]['HP'] = Math.max(0, updatedPlayerTeam[currentPkmn]['HP'] - movimiento.daño);
        }
    
        setPlayerTeam(updatedPlayerTeam);
        setDialog(`${enemyTeam[currentEnemy].nombre}${dialogs[2].string}${movimiento.nombre}`);
        setPlayerTurn(true);
    
        if (updatedPlayerTeam[currentPkmn]['HP'] === 0) {
            setTimeout(() => {
                setDialog(`${updatedPlayerTeam[currentPkmn]['nombre']}${dialogs[6].string}`);
            }, 1500);
            setTimeout(() => {
                setAvailable((prevAvailablePkmn) => {
                    const updatedAvailable = [...prevAvailablePkmn];
                    updatedAvailable[currentPkmn] = 0; 
                    if (updatedAvailable.indexOf(1) !== -1) {
                        setCurrent(updatedAvailable.indexOf(1));
                    } else {
                        handleGameOver('¡Derrota!');
                    }
                    return updatedAvailable;
                });
            }, 3000);
        } else {
            setTimeout(() => {
                resetTurn();
            }, 1500);
        }
    };
    
    
    useEffect(()=>{
        if(turn>0){
            setSection(3);
            setTimeout(()=>{
                setDialog(`${dialogs[8].string}${enemyTeam[currentEnemy].nombre}`)
            }, 1500)
            setTimeout(()=>{
                takeTurn()
            }, 3000);
        }
    }, [currentEnemy])

    useEffect(()=>{
        if(turn>0){
            setSection(3)
            setDialog(`${playerTeam[currentPkmn]['nombre']}${dialogs[7].string}`);
            if(!playerTurn){
                setTimeout(()=>{
                    takeTurn()
                }, 1500);
            } else{
                setTimeout(()=>{
                    setDialog(`${playerTeam[currentPkmn]['nombre']}${dialogs[7].string}`)
                }, 1500)
                setTimeout(()=>{
                    resetTurn()
                },3000)
            }
        }
    }, [currentPkmn])

    const changePokemon = (index) => {
        setTurn(turn+1)
        setPlayerTurn(false)
        setCurrent(index);
    }

    const resetTurn = () => {
        setSection(0);
        setDialog(dialogs[1].string);
    }

    return(
        <>
            <main className="text-2xl">
                {!gameRunning && <Modal message={endStatus}/>}
                <section className="pkmn-health absolute w-full flex">
                    <article className="w-1/2 flex justify-center items-end gap-x-2">
                        <p>HP</p>
                        <article className="border-2 border-black rounded h-9 w-1/3 flex justify-end">
                            <div className="green-enemy h-8 bg-green-300 z-10 inline-block"
                            style={{width:`${playerTeam[currentPkmn].HP * 100 / 200}%`}}></div>
                            <div className="red-enemy h-8 bg-red-300 z-20 inline-block"
                            style={{width:`${100 - (playerTeam[currentPkmn].HP * 100 / 200)}%`}}></div>
                        </article>
                    </article>
                    <article className={`w-1/2 flex justify-center items-end gap-x-2 ${gameRunning ? '':'hidden'}`}>
                        <p>HP</p>
                        <article className="border-2 border-black rounded h-9 w-1/3 flex justify-end">
                            <div className="green-enemy h-8 bg-green-300 z-10 inline-block"
                            style={{width:`${enemyTeam[currentEnemy].HP * 100 / 200}%`}}></div>
                            <div className="red-enemy h-8 bg-red-300 z-20 inline-block"
                            style={{width:`${100 - (enemyTeam[currentEnemy].HP * 100 / 200)}%`}}></div>
                        </article>
                    </article>
                </section>
                <section className="pkmn-sprites absolute w-full flex justify-between">
                    <article className="ally-sprite w-1/2 flex justify-center">
                        <img src={playerTeam[currentPkmn]['img']} style={{transform:'scaleX(-1)'}}/>
                    </article>
                    <article className="enemy-sprite w-1/2 flex justify-center">
                        <img src={enemyTeam[currentEnemy]['img']}/>
                    </article>
                </section>
                <section className="pkmn-teams absolute w-full flex justify-between px-4">
                    <div className="flex items-center w-1/3">
                        <h2>Mi Equipo</h2>
                        <div className="mx-3 gap-x-2 flex">
                            {playerTeam.map((allyPkmn, index)=>(
                                <img key={index} 
                                src={allyPkmn['HP'] > 0
                                ? "/assets/PokeBallFull.svg"
                                : "/assets/PokeballEmpty.webp"}
                                style={{height:'3vh'}}></img>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center w-1/3 justify-end">
                        <h2>Equipo Enemigo</h2>
                        <div className="mx-3 gap-x-2 flex">
                            {enemyTeam.map((enemyPkmn, index)=>(
                                <img key={index} 
                                src={enemyPkmn.HP > 0 
                                ? "/assets/PokeBallFull.svg"
                                : "/assets/PokeballEmpty.webp"}
                                style={{height:'3vh'}}/>
                            ))}
                        </div>
                    </div>
                </section>
                <section className="fight-menu absolute w-full">
                    <section className="flex h-full">
                        <p className="m-4 rounded-md border-2 w-1/2 border-teal-400 flex items-center justify-center">{currentDialog}</p>
                        <div className={`m-4 rounded-md border-2 w-1/2 border-teal-400 w-1/2 flex ${currentSection !== 0 ? 'hidden' : '' }`}>
                            <div onClick={()=> setSection(1)} className="w-1/2 justify-center items-center flex luchar-btn"><p>LUCHAR</p></div>
                            <div onClick={()=> setSection(2)} className="w-1/2 justify-center items-center flex pokemon-btn"><p>POKÉMON</p></div>
                        </div>
                        <div className={`m-4 rounded-md border-2 w-1/2 border-teal-400 flex items-center justify-center 
                        ${currentSection !== 1 ? 'hidden' : '' }`}>
                            <section className="h-full grid grid-rows-2 grid-cols-2 w-3/4">
                                {playerTeam[currentPkmn]['movimientos'].map((movimiento, index)=>(
                                    <article key={index} className="px-2 text-base text-center hover:underline decoration-solid hover:bg-teal-400 cursor-default border-2 m-2 border-teal-400 rounded-md flex items-center justify-center"
                                    onClick={() => dealDmg(movimiento)}>
                                        {movimiento["nombre"]}
                                    </article>
                                ))}
                            </section>
                            <section className="px-3 hover:underline decoration-solid cursor-default"
                            onClick={()=>setSection(0)}>
                                Cancelar
                            </section>
                        </div>
                        <div className={`m-4 rounded-md border-2 w-1/2 border-teal-400 grid grid-cols-2 grid-rows-2
                        ${currentSection !== 2 ? 'hidden' : '' }`}>
                            {playerTeam.map((member,index)=>(
                                <article key={index} 
                                className={`${member['HP'] > 0 ? 'hover:underline decoration-solid hover:bg-teal-400' : 'opacity-50'} cursor-default border-2 m-2 border-teal-400 rounded-md flex items-center justify-center`}
                                onClick={member['HP'] > 0 ? ()=>changePokemon(index) : ()=>{}}>
                                    {member['nombre']}
                                </article>
                            ))}
                            <article className="hover:underline decoration-solid hover:bg-red-300 cursor-default border-2 m-2 border-red-300 rounded-md flex items-center justify-center"
                            onClick={()=>setSection(0)}>
                                Cancelar
                            </article>
                        </div>
                    </section>
                </section>
            </main>
        </>
    )
}