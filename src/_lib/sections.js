// A shared publishing rule for collections and verification.
export const articleSection = (data) => {
  if (data.section !== undefined && data.section !== null && data.section !== '') {
    if (!['featured', 'news'].includes(data.section)) {
      throw new Error(`Invalid section for "${data.title}": use featured or news.`);
    }
    return data.section;
  }
  return data.author && data.author !== (data.site?.defaultAuthor || 'Singularity Review') ? 'featured' : 'news';
};
