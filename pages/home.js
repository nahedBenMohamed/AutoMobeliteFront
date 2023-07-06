import { useEffect, useState } from 'react'
import {io} from 'socket.io-client'

const socket = io('http://localhost:8000',{transports:['websocket']})

export default function Home ()  {
    const [name, setName] = useState('')
    const [list, setList] = useState([]);
    const handlepost = (e) => {
        socket.emit("roomsatu", {post:name})
    }
    socket.on("kirim",(data) =>{
        console.log(data)
    })

    return (
        <div>
            <div class="logo"></div>
            <div class="icon" onClick="toggleNotifi()">
                <img src="img/bell.png" alt=""/> <span>{/*Afficher le nombre de message ici*/}</span>
            </div>
            <div class="notifi-box" id="box">
                <h2>Notifications <span>17</span></h2>
                <div class="notifi-item">
                        <div class="text">
                            <h4>Elias Abdurrahman</h4>
                            <p>@lorem ipsum dolor sit amet</p>
                        </div>
                </div>
            </div>
        </div>

    )
}