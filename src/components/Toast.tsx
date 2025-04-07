interface ToastProps {
    message: string;
    type?: "error" | "success";
}

export const Toast = ({ message, type = "error" }: ToastProps) => {
    return (
        <div
            className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white shadow-md z-50 transition-opacity duration-300 ease-in-out
        ${type === "error" ? "bg-red-600" : "bg-green-600"}
      `}
            style={{
                opacity: 1,
            }}
        >
            <p className="font-semibold text-sm">{message}</p>
        </div>
    );
};
