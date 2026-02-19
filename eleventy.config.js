export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");

  eleventyConfig.addCollection("project", function(collectionApi) {
    return collectionApi.getFilteredByTag("project")
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0));
  });
}

export const config = {
  dir: {
    input: "src",
    output: "_site"
  }
};
