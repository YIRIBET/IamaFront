import jsPDF from 'jspdf';

function Reporte(){
    const reporteData ={
        nombre:"hola",
        cantidad:"842"
    }
    const generarPDF =() =>{
        const doc = new jsPDF();
        doc.text('Reporte',95,20);
        doc.text('nombre de factura: ${reporteData.nombre}',10,20);

        //guardar pdf con su nombre 
        doc.save('reporte_${reporteData.nombre}.pdf');
    }
    return(
        <>
        <h1>Reporte</h1>
       <p>nombre de reporte {reporteData.nombre}</p>
        <button >Generar Reporte</button>
        <button
        onClick={generarPDF}
            type="submit"
            className="text-white w-full bg-green-400 hover:bg-green-500 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
           generar reporte
          </button>
        </>
    )
}
export default Reporte;