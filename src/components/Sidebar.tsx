import Link from 'next/link';
import { site, socialLinks, mainMenu } from '@/lib/site';
import Icon from './Icon';
import ThemeToggle from './ThemeToggle';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <img className="avatar" src={site.avatar} alt="avatar" />
      <div>
        <h1 className="site-title">{site.shortTitle}</h1>
        <p className="site-subtitle">{site.subtitle}</p>
      </div>
      <nav>
        {mainMenu.map((item) => (
          <Link key={item.url} href={item.url}>
            <Icon name={item.icon} />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="social-row">
        {socialLinks.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" title={s.name}>
            <Icon name={s.icon} />
          </a>
        ))}
        <ThemeToggle />
      </div>
      <div className="footer">
        © {site.since} - {new Date().getFullYear()} {site.shortTitle}
      </div>
    </aside>
  );
}
