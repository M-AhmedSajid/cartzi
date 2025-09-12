import Image from "next/image";
import Link from "next/link";
import { getParentCategories } from "@/sanity/helpers/product";
import { urlFor } from "@/sanity/lib/image";
import SectionHeading from "../SectionHeading";

const layoutClasses = [
  "px-10 py-16 col-span-2 md:col-span-4 md:row-span-1 lg:row-span-2",
  "px-10 py-16 col-span-2 md:col-span-2 md:row-span-2 lg:row-span-3",
  "px-5 py-10 md:col-span-2 md:row-span-1 lg:row-span-3",
  "px-5 py-10 md:col-span-2 md:row-span-1 lg:row-span-3",
  "px-5 py-10 md:col-span-3 md:row-span-1 lg:col-span-1 lg:row-span-2",
  "px-5 py-10 md:col-span-3 md:row-span-1 lg:col-span-1 lg:row-span-2",
];

const CategoriesGrid = async () => {
  const categories = await getParentCategories();

  return (
    <section>
      <SectionHeading title="Browse by Category" txt="Everything organized, just for you" />
      <div className="grid grid-cols-2 md:grid-cols-6 md:grid-rows-3 lg:grid-rows-5 gap-4">
        {categories?.map((ctg, idx) => (
          <Link
            key={ctg._id}
            href={`/category/${ctg.slug}`}
            className={`relative group rounded-2xl overflow-hidden shadow-md ${layoutClasses[idx] || ""}`}
          >
            <Image
              src={urlFor(ctg.image).url()}
              alt={ctg.image?.alt || ctg.name}
              fill
              sizes="100%"
              className="object-cover w-full h-full group-hover:scale-105 hoverEffect -z-10"
            />
            <div className="z-10">
              <h3 className="text-xl font-semibold text-background">
                {ctg.name}
              </h3>
              {ctg.description && (
                <p className="text-sm text-muted">{ctg.description}</p>
              )}
            </div>
            <div className="absolute inset-0 bg-foreground/50 group-hover:bg-foreground/60 -z-10 hoverEffect" />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoriesGrid;
