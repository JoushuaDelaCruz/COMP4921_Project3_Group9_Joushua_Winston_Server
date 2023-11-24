const images = [
  {
    public_id: "dog-pic2_jey5zy",
  },
  {
    public_id: "dog-pic_ve5jcg",
  },
  {
    public_id: "profile_azdz92",
  },
  {
    public_id: "hi1eqfkhfebuat1milo2",
  },
  {
    public_id: "kbd0pjadup8eqfukqtub",
  },
  {
    public_id: "dog-pic3_ubquam",
  },
  {
    public_id: "cutie-patoty_byyicr",
  },
];

export const getRandomImage = () => {
  const image = images[Math.floor(Math.random() * images.length)];
  return image.public_id;
};

console.log(getRandomImage());
