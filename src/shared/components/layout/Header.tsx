import Image from 'next/image';

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center">
        <Image
          src="/images/logo_lightgrey.png"
          alt="Fidelity Logo"
          width={32}
          height={32}
        />
        <span className="ml-4 text-xl font-semibold text-gray-800">
          Fidelity Pluto - Dashboard
        </span>
      </div>
    </header>
  );
}