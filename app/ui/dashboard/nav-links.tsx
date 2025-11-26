'use client';

import {
  UserGroupIcon,
  HomeIcon,
  BoltIcon,
  BookOpenIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';

export default function NavLinks() {
  const pathname = usePathname();

  // Exemple d'URL : /dashboard/ABCD12/3
  const pathSegments = pathname.split('/');

  const code = pathSegments[2];      
  const idProjet = pathSegments[3];  
  const userId = pathSegments[4] || null; // userId peut être optionnel

  const links = [
    { name: 'Home', href: `/dashboard/${code}/${idProjet}/${userId}`, icon: HomeIcon },
    { name: 'stories', href: `/dashboard/${code}/${idProjet}/${userId}/stories`, icon: DocumentDuplicateIcon },
    { name: 'daily', href: `/dashboard/${code}/${idProjet}/${userId}/daily`, icon: BookOpenIcon },
    { name: 'sprints', href: `/dashboard/${code}/${idProjet}/${userId}/sprints`, icon: BoltIcon },
  ];

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}>
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
