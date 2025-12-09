import { useSearchParams } from 'react-router-dom';
import BookFlight from './BookFlight';
import BookHotel from './BookHotel';

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');

  if (type === 'flight') {
    return <BookFlight />;
  } else if (type === 'hotel') {
    return <BookHotel />;
  } else {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Invalid booking type
        </div>
      </div>
    );
  }
};

export default BookingPage;


