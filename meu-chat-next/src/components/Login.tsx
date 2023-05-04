import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');

  const handleLogin = async () => {
    console.log(username);
    try {
      const requestRaw = await fetch('http://localhost:8080/auth', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const { id, username: user } = (await requestRaw.json()) as {
        id: string;
        username: string;
      };

      console.log(id, user);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className='py-4 text-center flex flex-col justify-center mx-auto my-8 w-60 rounded bg-gray-400'>
      <h3 className='text-white font-sans font-semibold'>Nome de usuário</h3>
      <input
        type='text'
        onChange={(element) => setUsername(element.target.value)}
        className='w-48 rounded bg-slate-300 mx-auto my-2'
      />
      <button onClick={handleLogin} className='rounded bg-slate-800 text-white my-2 w-40 mx-auto'>
        Login
      </button>
    </div>
  );
}
