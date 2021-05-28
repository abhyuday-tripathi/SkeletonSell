import { useRouter } from 'next/router';

const Item = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Item id is {id}</h1>
    </div>
  );
};

export default Item;
