import { useState, FormEvent } from 'react';
// import { IpInputProps } from '../types/IpSearchProps.js';
import { IpInputProps } from '../types/IpSearchProps';

const IpInput = ({ onSearch, isLoading }: IpInputProps) => {
    const [ip, setIp] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault;
        if (ip.trim()) onSearch(ip.trim());
    };
    return (
        <form onSubmit={handleSubmit} className="ip-input">
            <input
                type="text"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder='Escriu la adreça IP'
                pattern="^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
                title="Escriu una valida IPv4"
                required
            />
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Investigant...' : 'Descobrir'}
            </button>
        </form>
    );
}