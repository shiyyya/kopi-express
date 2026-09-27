import alertIcon from "/src/assets/icons/alert.svg";
import "./confirmation-card.css";

export default function ConfirmationCard({
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
}) {
    return (
        <div className="ConfirmationCardOverlay" onClick={onCancel}>
            <div
                className="ConfirmationCard"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="ConfirmationCardIcon">
                    <img src={alertIcon} alt="" />
                </div>
                <h2>{title}</h2>
                <p>{message}</p>
                <div className="ConfirmationCardActions">
                    <button
                        type="button"
                        className="ConfirmationCardCancel"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        className="ConfirmationCardConfirm"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}