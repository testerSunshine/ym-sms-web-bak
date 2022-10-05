<script type="jsx">
export default {
    name: "AbstractPagination",

    functional: true,

    props: {
        model: {
            type: Object,
            default: () => ({total: 0, page: 1, pageSize: 15, pageSizes: [10,20,50,100,500,1000,5000]})
        }
    },


    render(h, context) {
        const {model: {total, page, pageSize, pageSizes}} = context.props
        return (
            <el-pagination
                background
                current-page={page}
                page-size={pageSize}
                page-sizes = {pageSizes}
                total={total}
                layout="total, sizes, prev, pager, next, jumper"
                {...context.data}
            />
        )
    }
}
</script>
