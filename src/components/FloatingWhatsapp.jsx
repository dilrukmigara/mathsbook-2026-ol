'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { MATHSBOOK_CONFIG } from '../config/mathsbookConfig';

export default function FloatingWhatsapp() {
    return (
        <a 
            href={`https://wa.me/${MATHSBOOK_CONFIG.tutor.whatsapp}`} 
            target="_blank" 
            rel="noreferrer" 
            className="whatsapp-float-btn"
            title="Chat on WhatsApp 0729780053"
            aria-label="Chat on WhatsApp: 0729780053"
        >
            <MessageCircle size={28} aria-hidden="true"/>
        </a>
    );
}
