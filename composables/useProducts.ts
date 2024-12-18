export const useProducts = () => {
  const getLatestProducts = async () => {
    try {
      const { data, pending, error } = await useAsyncGql({
        operation: 'GetProducts',
        variables: { first: 6 }
      })
      console.log('Latest Products Response:', data)
      return { data, pending, error }
    } catch (error) {
      console.error('Error fetching latest products:', error)
      throw error
    }
  }

  const getAllProducts = async () => {
    try {
      const { data, pending, error } = await useAsyncGql({
        operation: 'GetProducts',
        variables: { first: 50 }
      })
      console.log('All Products Response:', data)
      return { data, pending, error }
    } catch (error) {
      console.error('Error fetching all products:', error)
      throw error
    }
  }

  const getProduct = async (handle: string) => {
    try {
      const { data, pending, error } = await useAsyncGql({
        operation: 'GetProduct',
        variables: { handle }
      })
      console.log('Single Product Response:', data)
      return { data, pending, error }
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    }
  }

  return {
    getLatestProducts,
    getAllProducts,
    getProduct
  }
}