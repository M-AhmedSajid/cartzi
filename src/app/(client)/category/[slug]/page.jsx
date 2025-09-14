export async function generateMetadata({ params }) {
  const { slug } = await params;

  return {
    title: `${slug.replace(/-/g, " ")} | Cartzi Shop`,
    description: `Discover the best ${slug.replace(/-/g, " ")} in our Cartzi store.`,
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {slug.replace(/-/g, " ")}
      </h1>
    </div>
  );
}
