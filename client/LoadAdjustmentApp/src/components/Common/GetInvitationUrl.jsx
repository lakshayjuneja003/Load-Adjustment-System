import axios from "axios";
import { useEffect, useState } from "react";
import './GetUrl.css'; 

const GetUrl = ({ role }) => {
    const [url, setUrl] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const getUrlFromBackend = async () => {
            try {
                const response = await axios.get(`http://localhost:3004/api/v1/${role}/getinvitationurl`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    withCredentials: true,
                });
                if (response.status === 200) {
                    setUrl(response.data.url); // Assuming response has a 'url' field
                }
            } catch (error) {
                console.log("Error occurred:", error);
            }
        };

        getUrlFromBackend();
    }, [role]);

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset copy status after 2 seconds
    };

    return (
        <div className="url-container">
            <h1>Invitation URL</h1>
            {url && (
                <div className="url-box">
                    <p>{url}</p>
                    <button className="copy-btn" onClick={handleCopy}>
                        {copied ? "Copied!" : "Copy URL"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default GetUrl;
