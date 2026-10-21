import { RepositoryCard } from '@/components/sections/RepositoryCard';
import { fetchUserRepositories } from '@/lib/adapters/github';

export async function getStaticProps() {
  try {
    const repos = await fetchUserRepositories();
    return {
      props: { repositories: repos },
      revalidate: 3600,
    };
  } catch (error) {
    console.warn('GitHub repositories fetch failed:', error);
    return {
      props: { repositories: [] },
      revalidate: 60,
    };
  }
}

interface RepositoriesPageProps {
  repositories: {
    name: string;
    fullName: string;
    description: string | null;
    htmlUrl: string;
    stargazersCount: number;
    language: string | null;
    updatedAt: string;
    commitCount: number;
    lastCommitAt: string | null;
  }[];
}

export default function RepositoriesPage({ repositories }: RepositoriesPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
      <div className="mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          GitHub Repositories
        </h1>
        <p className="text-lg text-[#8b949e] max-w-2xl">
          Public repositories from GitHub.
        </p>
      </div>

      {repositories.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#8b949e] text-lg">
            No repositories found. Check your GitHub username configuration.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {repositories.map((repo) => (
            <RepositoryCard
              key={repo.name}
              title={repo.name}
              description={repo.description || 'No description provided.'}
              url={repo.htmlUrl}
              stargazers={repo.stargazersCount}
              commitCount={repo.commitCount}
              lastCommitAt={repo.lastCommitAt}
              language={repo.language}
            />
          ))}
        </div>
      )}
    </div>
  );
}
