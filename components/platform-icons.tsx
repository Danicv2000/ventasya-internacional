import React from 'react';

interface PlatformIconProps {
  className?: string;
  size?: number;
}

// TEMU Official Icon - Authentic representation
export const TemuIcon = ({ className = "w-20 h-16", size = 64 }: PlatformIconProps) => (
    <a title="WhaleCo Inc., Public domain, via Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File:Temu_logo.svg">
        <img width={size} alt="Wordmark of Temu" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Temu_logo.svg/512px-Temu_logo.svg.png?20240905101158" className={className} />
    </a>
);

// SHEIN Official Icon - Authentic representation
export const SheinIcon = ({ className = "w-20 h-16", size = 64 }: PlatformIconProps) => (
    <a title="Shein, Public domain, via Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File:Shein_Logo_2017.svg">
        <img width={size} alt="Logo of Shein" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Shein_Logo_2017.svg/512px-Shein_Logo_2017.svg.png?20240613050303" className={className} />
    </a>
);

// AMAZON Official Icon - Authentic representation
export const AmazonIcon = ({ className = "w-20 h-16", size = 64 }: PlatformIconProps) => (
    <a title="Amazon.com, Inc., Public domain, via Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File:Amazon_logo.svg">
        <img width={size} alt="Logo of Amazon from 2012 to 2024" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/512px-Amazon_logo.svg.png?20250504041148" className={className} />
    </a>
);