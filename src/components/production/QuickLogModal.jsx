import React, { useState } from 'react';
import { Card, Button } from '../common/UI';
import { MINERALS, LOCATIONS, useData } from '../../context/DataContext';

const QuickLogModal = ({ isOpen, onClose }) => {
    const { addProductionLog } = useData();
    const [formData, setFormData] = useState({
        mineral: MINERALS[0],
        location: LOCATIONS[0],
        quantity: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.quantity) return;
        
        addProductionLog({
            ...formData,
            quantity: parseFloat(formData.quantity)
        });
        setFormData({ ...formData, quantity: '' });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <Card className="w-full max-w-md card-glass shadow-2xl" title="Quick Production Log">
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="input-group">
                        <label>Resource Stream</label>
                        <select 
                            value={formData.mineral}
                            onChange={(e) => setFormData({...formData, mineral: e.target.value})}
                        >
                            {MINERALS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Extraction Location</label>
                        <select 
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                        >
                            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Quantity (Tons)</label>
                        <input 
                            type="number" 
                            step="0.1" 
                            placeholder="0.0"
                            value={formData.quantity}
                            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="button" variant="secondary" onClick={onClose} style={{ flex: 1 }}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" style={{ flex: 1 }}>
                            Submit Log
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default QuickLogModal;
