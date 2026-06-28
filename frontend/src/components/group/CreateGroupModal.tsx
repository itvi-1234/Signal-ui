import React, { useState } from 'react';
import Modal from '../shared/Modal';

export default function CreateGroupModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [name, setName] = useState('');
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4 text-white">Create Group</h2>
      <input 
        type="text" 
        value={name} 
        onChange={e => setName(e.target.value)} 
        placeholder="Group Name" 
        className="w-full bg-signal-surface-dark text-white rounded p-3 mb-4" 
      />
      <button className="w-full bg-signal-blue text-white rounded py-3">Create</button>
    </Modal>
  );
}
