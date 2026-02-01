import { useEffect, useState } from "react";
import * as openpgp from "openpgp";

export const useReadSecrets = () => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const fetchSecrets = async () => {
        try {
            console.log("Intentando leer archivos...");

            // 1. Leer Public Key
            const pubKeyResponse = await fetch("/secrets/publickey-eltoque.asc");

            if (!pubKeyResponse.ok) throw new Error("Error leyendo public key");
            const publicKeyContent = await pubKeyResponse.text();

            console.log(publicKeyContent);

            // 2. Leer Signature
            const signatureResponse = await fetch("/secrets/signature-eltoque.asc");

            if (!signatureResponse.ok) throw new Error("Error leyendo signature");
            const signatureContent = await signatureResponse.text();

            console.log(signatureContent);

            // 3. Cargar clave privada PGP
            const privateKey = await openpgp.readPrivateKey({
                armoredKey: publicKeyContent,
            });

            // 4. Crear payload JWT
            const header = { alg: "PS512", typ: "JWT" }; // o "RS256" si lo soporta
            const payload = {
            iss: publicKeyContent.substring(0, 20),
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 7200, // 2 horas
            };

            const encodedHeader = btoa(JSON.stringify(header));
            const encodedPayload = btoa(JSON.stringify(payload));

            const messageToSign = `${encodedHeader}.${encodedPayload}`;

            // 5. Firmar el mensaje con openpgp
            const message = await openpgp.createMessage({ text: messageToSign });
            const signature = await openpgp.sign({
            message,
            signingKeys: privateKey,
            format: "armored", // o "binary"
            });

            // 6. Crear un token tipo JWT con la firma
            const jwt = `${messageToSign}.${encodeURIComponent(signature)}`;
            const bearerToken = `Bearer ${jwt}`;

            console.log("Bearer Token generado:", bearerToken);

            // Guardar token
            localStorage.setItem("bearerToken", bearerToken);

            // Guardar token localmente
            setToken(bearerToken as string);
            localStorage.setItem("bearerToken", bearerToken);
        } catch (error) {
            console.error("Error al intentar leer los archivos:", error);
        }
        };

        fetchSecrets();
    }, []);

    return token;
};
