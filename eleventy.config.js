export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");

  // Returns true if any project in the collection has a heroSketch
  eleventyConfig.addFilter("hasSketches", function(projects) {
    return projects.some(p => p.data.heroSketch);
  });

  // Returns deduplicated array of sketch names used across projects
  eleventyConfig.addFilter("sketchSlugs", function(projects) {
    const slugs = projects
      .filter(p => p.data.heroSketch)
      .map(p => p.data.heroSketch);
    return [...new Set(slugs)];
  });

  // All projects sorted by order
  eleventyConfig.addCollection("project", function(collectionApi) {
    return collectionApi.getFilteredByTag("project")
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0));
  });

  // Featured projects only
  eleventyConfig.addCollection("featured", function(collectionApi) {
    return collectionApi.getFilteredByTag("project")
      .filter(p => p.data.featured)
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0));
  });

  // Projects grouped by start year (descending)
  eleventyConfig.addCollection("projectsByYear", function(collectionApi) {
    const projects = collectionApi.getFilteredByTag("project")
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0));

    const byYear = {};
    projects.forEach(p => {
      const startYear = parseInt(p.data.year);
      if (!byYear[startYear]) byYear[startYear] = [];
      byYear[startYear].push(p);
    });

    return Object.keys(byYear)
      .sort((a, b) => b - a)
      .map(year => ({ year, projects: byYear[year] }));
  });
}

export const config = {
  dir: {
    input: "src",
    output: "_site"
  }
};
