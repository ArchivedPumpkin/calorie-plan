import React from "react";
import { authClient } from "../lib/auth-client"; // Adjust the import path as needed


export default function AuthForm() {

    const [sign, setSign] = React.useState({ email: "", name: "", password: "" });
    const [isSigningIn, setIsSigningIn] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null); // Clear previous error before attempting new sign in/up
        setLoading(true);
        const { error } = isSigningIn
            ? await authClient.signIn.email({ email: sign.email, password: sign.password })
            : await authClient.signUp.email({ email: sign.email, name: sign.name, password: sign.password });
        setError(error ? error.message ?? "An unknown error occurred" : null);
        setLoading(false);
    }


    return (
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={sign.email} autoComplete="email" onChange={(e) => setSign({ ...sign, email: e.target.value })} required />
                {!isSigningIn && (
                    <>
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" name="name" value={sign.name} onChange={(e) => setSign({ ...sign, name: e.target.value })} required />
                    </>
                )}
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" minLength={6} value={sign.password} autoComplete={isSigningIn ? "current-password" : "new-password"} onChange={(e) => setSign({ ...sign, password: e.target.value })} required />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit" disabled={loading}>{isSigningIn ? "Sign In" : "Sign Up"}</button>
            </form>
            <button type="button" onClick={() => setIsSigningIn(!isSigningIn)}>
                {isSigningIn ? "No account? Create one" : "Already have an account? Sign In"}
            </button>

        </>
    )
}