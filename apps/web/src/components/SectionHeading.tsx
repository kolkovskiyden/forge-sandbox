// Adapted from Tailkit (free): Application UI → Components → Dividers → With Heading.
// https://tailkit.com/free-tailwind-components — © pixelcave, used under the Tailkit license.
export function SectionHeading({ title }: { title: string }) {
  return (
    <h2 className="my-6 flex items-center">
      <span aria-hidden="true" className="h-0.5 grow rounded-sm bg-gray-200 dark:bg-gray-700/75" />
      <span className="mx-3 text-lg font-medium">{title}</span>
      <span aria-hidden="true" className="h-0.5 grow rounded-sm bg-gray-200 dark:bg-gray-700/75" />
    </h2>
  );
}
