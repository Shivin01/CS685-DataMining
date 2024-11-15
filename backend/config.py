import os
basedir = os.path.abspath(os.path.dirname(__file__))
from dotenv import load_dotenv
load_dotenv()

DB_USER = os.environ.get('PG_DB_USER', "postgres")
DB_PASS = os.environ.get('PG_DB_PASS', "postgres")
DB_URI = os.environ.get('PG_DB_HOST', "localhost")
DB_NAME = os.environ.get('PG_DB_NAME', "deepfake_db")
JWT_SECRET_KEY = "f61aaf73202ad8ebaa2546d6290f96ac5311631bec0c8940b0ee6e6c900cb067ab65ae592c52534bf0117aa2bae972decce0703bac0024f998b98b569b30196d9dfd7c399805a6973017523eb5f5dc33dccec445832510013aa2a8e94eda009a20a17ba9679ffb49bf15c733bbea6109683711b00682d2ec470e14ba587d6318a54586b55845f20cd7c172265ba28b2a81d8524cd31d42a67d5dd7e951cf9e0db047ee9cee41a24a797e7e4838cc7dc93187b06ef92457f728ea8c4a0b2bba69cba28740e253730ed3a7f9667e35301c5299c3f9f57b22d051c67648591554e8aa00df89597983f1220c8e592d59b74f35a92a211fbf947ba5546eb50c8c5594"
JWT_ALGORITHM = "HS256"
