// idea/_components/layouts/Header.tsx
export function Header({ title }: { title: string }) {
  return (
    <header className="bg-gray-800 text-white p-4 text-center text-xl font-bold">
      {title}
    </header>
  );
}
