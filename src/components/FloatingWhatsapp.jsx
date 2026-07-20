import React from 'react';
import { MessageSquare } from 'lucide-react';
import { MATHSBOOK_CONFIG } from '../config/mathsbookConfig';

export default function FloatingWhatsapp() {
    return (
        <a 
            href={`https://wa.me/${MATHSBOOK_CONFIG.tutor.whatsapp}`} 
            target="_blank" 
            rel="noreferrer" 
            className="whatsapp-float-btn"
            title="Chat on WhatsApp 0779780053"
        >
            <MessageSquare size={28} />
        </a>
    );
}
