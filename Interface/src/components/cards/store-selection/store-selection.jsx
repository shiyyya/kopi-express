import "./store-selection.css";
import Button from "/src/components/elements/button/button";
import CheckIcon from "/src/assets/icons/check.svg?react";

const stores = [
    {
        id: "01M34B40SEJKXD58FB337RY1RD",
        name: "Kopi-Express Poblacion Branch",
        address: "Poblacion, Pandi, Bulacan",
    },
    {
        id: "01M34B3AZHBT272V4H49CWZZ4E",
        name: "Kopi-Express Bunsuran II Branch",
        address: "Bunsuran II, Pandi, Bulacan",
    },
    {
        id: "01M34B2F2M5GH5EHJA2PARV0TK",
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