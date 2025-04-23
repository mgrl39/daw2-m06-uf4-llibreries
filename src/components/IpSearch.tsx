import { useState, FormEvent } from 'react';

interface IpSearchProps {
    onSearch: (ip: string) => void;
    isLoading: boolean;
}

const IpSearch = ({ onSearch, isLoading }: IpSearchProps) => {
    const [ip, setIp] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (ip.trim()) {
            onSearch(ip.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="ip-search">
            <input
                type="text"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="Enter IP address..."
                pattern="^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
                title="Please enter a valid IPv4 address"
                required
            />
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Search'}
            </button>
        </form>
    );
};

export default IpSearch; 