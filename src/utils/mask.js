export default function removeMask(value) {
    return value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
  }