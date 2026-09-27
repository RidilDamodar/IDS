import os
import urllib.request
import pandas as pd

def download_unsw_nb15():
    """
    Downloads a sample of the UNSW-NB15 dataset from a reliable raw GitHub source.
    """
    dataset_dir = os.path.dirname(os.path.abspath(__file__))
    train_csv = os.path.join(dataset_dir, "UNSW_NB15_training-set.csv")
    
    url = "https://raw.githubusercontent.com/Nir-J/ML-Projects/master/UNSW-Network_Packet_Classification/UNSW_NB15_training-set.csv"
    
    if not os.path.exists(train_csv):
        print(f"Downloading UNSW-NB15 dataset from {url}...")
        try:
            urllib.request.urlretrieve(url, train_csv)
            print("Download complete.")
        except Exception as e:
            print(f"Error downloading: {e}")
            return False
    else:
        print("Dataset already exists locally.")
    
    # Verify the download
    try:
        df = pd.read_csv(train_csv)
        print(f"Successfully loaded dataset with {len(df)} records and {len(df.columns)} features.")
        return True
    except Exception as e:
        print(f"Error reading the dataset: {e}")
        return False

if __name__ == "__main__":
    download_unsw_nb15()
