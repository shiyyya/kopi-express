import "./store-selection.css";
import Button from "/src/components/elements/button/button";
import CheckIcon from "/src/assets/icons/check.svg?react";

const stores = [
    {
        id: "poblacion",
        name: "Kopi-Express Poblacion Branch",
        address: "Poblacion, Pandi, Bulacan",
    },
    {
        id: "bunsuran",
        name: "Kopi-Express Bunsuran II Branch",
        address: "Bunsuran, Pandi, Bulacan",
    },
    {
        id: "cacarongbata",
        name: "Kopi-Express Cacarong Bata Branch",
        address: "Cacarong Bata, Pandi, Bulacan",
    },
];

function StoreSelection({ selectedStore, onSelect }) {
    return (
        <section className="StoreSelection">
            <h3 className="StoreSelectionTitle">Choose a Store</h3>
            <p className="StoreSelectionDescription">
                Select the store where you want to pick up your order.
            </p>
            <div className="StoreList">
                {stores.map((store) => (
                    <Button
                        key={store.id}
                        type="button"
                        className={`StoreOption ${selectedStore?.id === store.id ? "selected" : ""}`}
                        onClick={() => onSelect(store)}
                    >
                        <span className="StoreOptionDetails">
                            <strong>{store.name}</strong>
                            <span>{store.address}</span>
                        </span>
                        <span
                            className={
                                selectedStore?.id === store.id
                                    ? "StoreCheck"
                                    : "StoreRadio"
                            }
                        >
                            {selectedStore?.id === store.id && <CheckIcon />}
                        </span>
                    </Button>
                ))}
            </div>
        </section>
    );
}

export default StoreSelection;