// // src/components/5-pages/JoinPage/join-page.component.tsx
// import React, { useState } from 'react'; 
// import { useParams, useNavigate } from 'react-router-dom';
// import AppLayout from '../../4-templates/AppLayout/app-layout.component';
// import JoinGame from '../../3-organisms/JoinGame/join-game.component';
// import { type PlayerRole } from '../../2-molecules/JoinGameForm/join-game-form.component';
// import { type RoomState } from '../../../hooks/useRoomState';

// const JoinPage: React.FC = () => {
//   const { gameId } = useParams<{ gameId: string }>();
//   const navigate = useNavigate();

//   // REFACTOR 1: Add state for an error message instead of using alert()
//   const [error, setError] = useState<string | null>(null);

//   const handleJoinSuccess = (name: string, role: PlayerRole) => {
 
//     setError(null);

//     if (!gameId) return;

//     try {
//       const storedState = localStorage.getItem(gameId);
//       if (storedState) {
//         const currentRoom: RoomState = JSON.parse(storedState);
//         const updatedRoom: RoomState = {
//           ...currentRoom,
//           players: [...currentRoom.players, { name, role }],
//         };
//         localStorage.setItem(gameId, JSON.stringify(updatedRoom));
//         window.dispatchEvent(new StorageEvent('storage', { key: gameId }));

//         sessionStorage.setItem('activeGameId', gameId);
//         sessionStorage.setItem('currentUserName', name);

//         navigate('/');
//       } else {
       
//         setError(`Error: No se encontró la sala de juego "${gameId}".`);
//       }
//     } catch (err) {
//       console.error('Failed to join room:', err);
  
//       setError('Ocurrió un error al unirse a la sala.');
//     }
//   };

//   return (
//     <AppLayout>    
//       {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
//       <JoinGame onJoinSuccess={handleJoinSuccess} />      
//     </AppLayout>
//   );
// };

// export default JoinPage;




// src/components/5-pages/JoinPage/join-page.component.tsx
import React, { useState } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../4-templates/AppLayout/app-layout.component';
import JoinGame from '../../3-organisms/JoinGame/join-game.component';
import { type PlayerRole } from '../../2-molecules/JoinGameForm/join-game-form.component';
import { type RoomState } from '../../../hooks/useRoomState';

const JoinPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleJoinSuccess = (name: string, role: PlayerRole) => {
    setError(null);

    if (!gameId) return;

    try {
      const storedState = localStorage.getItem(gameId);
      if (storedState) {
        const currentRoom: RoomState = JSON.parse(storedState);
        const updatedRoom: RoomState = {
          ...currentRoom,
          players: [...currentRoom.players, { name, role }],
        };
        localStorage.setItem(gameId, JSON.stringify(updatedRoom));
        window.dispatchEvent(new StorageEvent('storage', { key: gameId }));

        sessionStorage.setItem('activeGameId', gameId);
        sessionStorage.setItem('currentUserName', name);

        navigate('/');
      } else {
        setError(`Error: No se encontró la sala de juego "${gameId}".`);
      }
    } catch (err) {
      console.error('Failed to join room:', err);
      setError('Ocurrió un error al unirse a la sala.');
    }
  };

  return (
    <AppLayout>    
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <JoinGame 
        onJoinSuccess={handleJoinSuccess} 
        roomId={gameId || ''} // Pass the gameId as roomId
      />      
    </AppLayout>
  );
};

export default JoinPage;