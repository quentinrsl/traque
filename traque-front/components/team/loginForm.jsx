import Button from "../util/button";
import TextInput from "../util/textInput";

export default function LoginForm() {
    return (
        <form className="bg-white shadow-md max-w mx-auto p-5 mx-10 flex flex-col space-y-4">
            <h1 className="text-2xl font-bold text-center text-gray-700">Connexion équipe</h1>
            <TextInput placeholder="Code d'équipe" name="team-id" />
            <Button type="submit">Se connecter</Button>
        </form>
    )
}