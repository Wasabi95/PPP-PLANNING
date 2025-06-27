// src/components/2-molecules/HostSettingsModal/host-settings-modal.component.tsx
// src/components/2-molecules/HostSettingsModal/host-settings-modal.component.tsx

import React, { useState, useEffect } from 'react';
import { Dialog } from '../../3-organisms/Dialog/dialog.component';
import Input from '../../1-atoms/Input/input.component';
import Button from '../../1-atoms/Button/button.component';
import { type Player } from '../../3-organisms/GameBoard/hooks/useGameBoardLogic';
import { type CardValue } from '../../../hooks/useRoomState';
import './host-settings-modal.component.scss';

// The pools of values remain the same
const NUMBER_POOL = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 100];
const EMOJI_POOL = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦉', '🦄', '🐝', '🦖', '🐙', '🐠', '🐳', '🦀', '⭐', '❤️', '🔥', '🎉', '✅', '❌'];

// A helper function for shuffling arrays (Fisher-Yates algorithm)
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap elements
  }
  return newArray;
}


interface HostSettingsModalProps {
  // ... props remain the same
  players: Player[];
  currentDeck: CardValue[];
  onSaveDeck: (newDeck: CardValue[]) => void;
  onClose: () => void;
  revealerName?: string;
  onAssignRevealer: (playerName: string) => void;
}

export const HostSettingsModal: React.FC<HostSettingsModalProps> = ({
  // ... props destructuring remains the same
  players,
  currentDeck,
  onSaveDeck,
  onClose,
  revealerName,
  onAssignRevealer,
}) => {
  const [deckInputs, setDeckInputs] = useState<string[]>([]);

  useEffect(() => {
    // ... useEffect remains the same
    const deckForEditing = [...currentDeck];
    while (deckForEditing.length < 12) {
      deckForEditing.push('');
    }
    setDeckInputs(deckForEditing.slice(0, 12).map(String));
  }, [currentDeck]);

  const handleInputChange = (index: number, value: string) => {
    // ... handleInputChange remains the same
    const newInputs = [...deckInputs];
    newInputs[index] = value;
    setDeckInputs(newInputs);
  };

  // --- THIS IS THE UPDATED LOGIC ---
  const handleRandomize = () => {
    // 1. Shuffle both pools independently
    const shuffledNumbers = shuffleArray(NUMBER_POOL);
    const shuffledEmojis = shuffleArray(EMOJI_POOL);

    // 2. Take the first 10 numbers and the first 2 emojis
    const selectedNumbers = shuffledNumbers.slice(0, 10);
    const selectedEmojis = shuffledEmojis.slice(0, 2);

    // 3. Combine them into a single array of 12 items
    const combinedDeck = [...selectedNumbers, ...selectedEmojis];

    // 4. Shuffle the final combined array to mix the emojis and numbers
    const finalShuffledDeck = shuffleArray(combinedDeck);

    // Set the state with the new, perfectly balanced deck
    setDeckInputs(finalShuffledDeck.map(String));
  };
  // --- END OF UPDATED LOGIC ---
  
  const handleSave = () => {
    // ... handleSave remains the same
    const finalDeck = deckInputs
      .map(val => val.trim())
      .filter(Boolean)
      .map(val => {
        const num = parseFloat(val);
        return isNaN(num) ? val : num;
      });
    
    onSaveDeck(finalDeck as CardValue[]);
    onClose();
  };

  return (
    <Dialog title="Host Settings" onClose={onClose}>
      <div className="host-settings-modal">
        {/* The rest of your JSX remains exactly the same */}
        <section className="settings-section">
          <h3>Players in Room ({players.length})</h3>
          <ul className="player-list">
            {players.map(p => {
              const isCurrentRevealer = p.name === revealerName;
              return (
                <li key={p.name} className={isCurrentRevealer ? 'is-revealer' : ''}>
                  {p.name}
                  {isCurrentRevealer && <span className="revealer-tag" title="Current Revealer">👑</span>}
                  {!isCurrentRevealer && (
                    <button 
                      className="assign-revealer-btn" 
                      onClick={() => onAssignRevealer(p.name)}
                      title={`Make ${p.name} the revealer`}
                    >
                      Make Revealer
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="settings-section">
          <h3>Customize Card Deck</h3>
          <div className="deck-editor-grid">
            {deckInputs.map((value, index) => (
              <Input
                key={index}
                value={value}
                onChange={(e) => handleInputChange(index, e.target.value)}
                maxLength={3}
              />
            ))}
          </div>
          <div className="deck-actions">
             <Button onClick={handleRandomize} variant="secondary">Randomize</Button>
             <Button onClick={handleSave}>Save Deck</Button>
          </div>
        </section>
      </div>
    </Dialog>
  );
};