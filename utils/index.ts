export const handleImageUrl = (image: EagleUse.Image) => {
  let prefix = `/library/${image.id}.info/${image.name}`;

  if (image.noThumbnail) {
    return `${prefix}.${image.ext}`;
  } else {
    return `${prefix}_thumbnail.png`;
  }
};
