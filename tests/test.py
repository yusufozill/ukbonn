import unittest
from main import isOdd  # main.py dosyasından isOdd fonksiyonunu import edin

class TestIsOdd(unittest.TestCase):
    def test_odd_number(self):
        self.assertTrue(isOdd(3))

    def test_even_number(self):
        self.assertFalse(isOdd(4))

    def test_non_integer_input(self):
        self.assertEqual(isOdd("hello"), "error")

if __name__ == '__main__':
    unittest.main()