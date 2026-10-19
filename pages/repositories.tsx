import { RepositoryCard } from '@/components/sections/RepositoryCard';
import { fetchRepositories } from '@/lib/adapters/notion';
import { enrichRepository } from '@/lib/adapters/github';


export async function getStaticProps() {
  try {
    const notionRepos = await fetchRepositories();
    const enriched = await Promise.all(
      notionRepos.map(async (repo) => {
        const gh = await enrichRepository({
          repoName: repo.repoName,
          url: repo.url,
        });
        return {
          title: repo.title,
          repoName: repo.repoName,
          description: repo.description || gh.description || '',
          url: repo.url || gh.htmlUrl || '',
          stargazers: gh.stargazersCount ?? repo.stargazers,
          commitCount: gh.commitCount ?? repo.commitCount,
          lastCommitAt: gh.lastCommitAt ?? repo.lastCommitAt,
          language: gh.language ?? repo.language,
        };
      })
    );
    return {
      props: { repositories: enriched },
      revalidate: 3600,
    };
  } catch {
    return {
      props: { repositories: [] },
      revalidate: 60,
    };
  }
}

interface RepositoriesPageProps {
  repositories: {
    title: string;
    repoName: string;
    description: string;
    url: string;
    stargazers: number;
    commitCount: number;
    lastCommitAt: string | null;
    language: string | null;
  }[];
}

export default function RepositoriesPage({ repositories }: RepositoriesPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#c9d1d9] mb-4">
          GitHub Repositories
        </h1>
        <p className="text-lg text-[#8b949e] max-w-2xl">
          Open-source projects and contributions — synced from Notion and GitHub.
        </p>
      </div>

      {repositories.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#8b949e] text-lg">
            No repositories found. Check your Notion and GitHub connections.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repositories.map((repo) => (
            <RepositoryCard key={repo.repoName} {...repo} />
          ))}
        </div>
      )}
    </div>
  );
}
