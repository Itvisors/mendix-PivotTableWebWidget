// This file was generated by Mendix Studio Pro.
//
// WARNING: Code you write here will be lost the next time you deploy the project.

package testpivottablewebwidget.proxies;

public class SalesOrderImportRow
{
	private final com.mendix.systemwideinterfaces.core.IMendixObject salesOrderImportRowMendixObject;

	private final com.mendix.systemwideinterfaces.core.IContext context;

	/**
	 * Internal name of this entity
	 */
	public static final java.lang.String entityName = "TestPivotTableWebWidget.SalesOrderImportRow";

	/**
	 * Enum describing members of this entity
	 */
	public enum MemberNames
	{
		SalesRepresentative("SalesRepresentative"),
		Location("Location"),
		Region("Region"),
		Customer("Customer"),
		OrderDate("OrderDate"),
		Item("Item"),
		Quantity("Quantity"),
		Price("Price"),
		TotalSaleAmount("TotalSaleAmount"),
		SalesOrderImportRow_SalesOrderImport("TestPivotTableWebWidget.SalesOrderImportRow_SalesOrderImport");

		private java.lang.String metaName;

		MemberNames(java.lang.String s)
		{
			metaName = s;
		}

		@java.lang.Override
		public java.lang.String toString()
		{
			return metaName;
		}
	}

	public SalesOrderImportRow(com.mendix.systemwideinterfaces.core.IContext context)
	{
		this(context, com.mendix.core.Core.instantiate(context, "TestPivotTableWebWidget.SalesOrderImportRow"));
	}

	protected SalesOrderImportRow(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixObject salesOrderImportRowMendixObject)
	{
		if (salesOrderImportRowMendixObject == null)
			throw new java.lang.IllegalArgumentException("The given object cannot be null.");
		if (!com.mendix.core.Core.isSubClassOf("TestPivotTableWebWidget.SalesOrderImportRow", salesOrderImportRowMendixObject.getType()))
			throw new java.lang.IllegalArgumentException("The given object is not a TestPivotTableWebWidget.SalesOrderImportRow");

		this.salesOrderImportRowMendixObject = salesOrderImportRowMendixObject;
		this.context = context;
	}

	/**
	 * @deprecated Use 'SalesOrderImportRow.load(IContext, IMendixIdentifier)' instead.
	 */
	@java.lang.Deprecated
	public static testpivottablewebwidget.proxies.SalesOrderImportRow initialize(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixIdentifier mendixIdentifier) throws com.mendix.core.CoreException
	{
		return testpivottablewebwidget.proxies.SalesOrderImportRow.load(context, mendixIdentifier);
	}

	/**
	 * Initialize a proxy using context (recommended). This context will be used for security checking when the get- and set-methods without context parameters are called.
	 * The get- and set-methods with context parameter should be used when for instance sudo access is necessary (IContext.createSudoClone() can be used to obtain sudo access).
	 */
	public static testpivottablewebwidget.proxies.SalesOrderImportRow initialize(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixObject mendixObject)
	{
		return new testpivottablewebwidget.proxies.SalesOrderImportRow(context, mendixObject);
	}

	public static testpivottablewebwidget.proxies.SalesOrderImportRow load(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixIdentifier mendixIdentifier) throws com.mendix.core.CoreException
	{
		com.mendix.systemwideinterfaces.core.IMendixObject mendixObject = com.mendix.core.Core.retrieveId(context, mendixIdentifier);
		return testpivottablewebwidget.proxies.SalesOrderImportRow.initialize(context, mendixObject);
	}

	public static java.util.List<testpivottablewebwidget.proxies.SalesOrderImportRow> load(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String xpathConstraint) throws com.mendix.core.CoreException
	{
		java.util.List<testpivottablewebwidget.proxies.SalesOrderImportRow> result = new java.util.ArrayList<testpivottablewebwidget.proxies.SalesOrderImportRow>();
		for (com.mendix.systemwideinterfaces.core.IMendixObject obj : com.mendix.core.Core.retrieveXPathQuery(context, "//TestPivotTableWebWidget.SalesOrderImportRow" + xpathConstraint))
			result.add(testpivottablewebwidget.proxies.SalesOrderImportRow.initialize(context, obj));
		return result;
	}

	/**
	 * Commit the changes made on this proxy object.
	 */
	public final void commit() throws com.mendix.core.CoreException
	{
		com.mendix.core.Core.commit(context, getMendixObject());
	}

	/**
	 * Commit the changes made on this proxy object using the specified context.
	 */
	public final void commit(com.mendix.systemwideinterfaces.core.IContext context) throws com.mendix.core.CoreException
	{
		com.mendix.core.Core.commit(context, getMendixObject());
	}

	/**
	 * Delete the object.
	 */
	public final void delete()
	{
		com.mendix.core.Core.delete(context, getMendixObject());
	}

	/**
	 * Delete the object using the specified context.
	 */
	public final void delete(com.mendix.systemwideinterfaces.core.IContext context)
	{
		com.mendix.core.Core.delete(context, getMendixObject());
	}
	/**
	 * @return value of SalesRepresentative
	 */
	public final java.lang.String getSalesRepresentative()
	{
		return getSalesRepresentative(getContext());
	}

	/**
	 * @param context
	 * @return value of SalesRepresentative
	 */
	public final java.lang.String getSalesRepresentative(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.SalesRepresentative.toString());
	}

	/**
	 * Set value of SalesRepresentative
	 * @param salesrepresentative
	 */
	public final void setSalesRepresentative(java.lang.String salesrepresentative)
	{
		setSalesRepresentative(getContext(), salesrepresentative);
	}

	/**
	 * Set value of SalesRepresentative
	 * @param context
	 * @param salesrepresentative
	 */
	public final void setSalesRepresentative(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String salesrepresentative)
	{
		getMendixObject().setValue(context, MemberNames.SalesRepresentative.toString(), salesrepresentative);
	}

	/**
	 * @return value of Location
	 */
	public final java.lang.String getLocation()
	{
		return getLocation(getContext());
	}

	/**
	 * @param context
	 * @return value of Location
	 */
	public final java.lang.String getLocation(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.Location.toString());
	}

	/**
	 * Set value of Location
	 * @param location
	 */
	public final void setLocation(java.lang.String location)
	{
		setLocation(getContext(), location);
	}

	/**
	 * Set value of Location
	 * @param context
	 * @param location
	 */
	public final void setLocation(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String location)
	{
		getMendixObject().setValue(context, MemberNames.Location.toString(), location);
	}

	/**
	 * Set value of Region
	 * @param region
	 */
	public final testpivottablewebwidget.proxies.Region getRegion()
	{
		return getRegion(getContext());
	}

	/**
	 * @param context
	 * @return value of Region
	 */
	public final testpivottablewebwidget.proxies.Region getRegion(com.mendix.systemwideinterfaces.core.IContext context)
	{
		Object obj = getMendixObject().getValue(context, MemberNames.Region.toString());
		if (obj == null)
			return null;

		return testpivottablewebwidget.proxies.Region.valueOf((java.lang.String) obj);
	}

	/**
	 * Set value of Region
	 * @param region
	 */
	public final void setRegion(testpivottablewebwidget.proxies.Region region)
	{
		setRegion(getContext(), region);
	}

	/**
	 * Set value of Region
	 * @param context
	 * @param region
	 */
	public final void setRegion(com.mendix.systemwideinterfaces.core.IContext context, testpivottablewebwidget.proxies.Region region)
	{
		if (region != null)
			getMendixObject().setValue(context, MemberNames.Region.toString(), region.toString());
		else
			getMendixObject().setValue(context, MemberNames.Region.toString(), null);
	}

	/**
	 * @return value of Customer
	 */
	public final java.lang.String getCustomer()
	{
		return getCustomer(getContext());
	}

	/**
	 * @param context
	 * @return value of Customer
	 */
	public final java.lang.String getCustomer(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.Customer.toString());
	}

	/**
	 * Set value of Customer
	 * @param customer
	 */
	public final void setCustomer(java.lang.String customer)
	{
		setCustomer(getContext(), customer);
	}

	/**
	 * Set value of Customer
	 * @param context
	 * @param customer
	 */
	public final void setCustomer(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String customer)
	{
		getMendixObject().setValue(context, MemberNames.Customer.toString(), customer);
	}

	/**
	 * @return value of OrderDate
	 */
	public final java.util.Date getOrderDate()
	{
		return getOrderDate(getContext());
	}

	/**
	 * @param context
	 * @return value of OrderDate
	 */
	public final java.util.Date getOrderDate(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.util.Date) getMendixObject().getValue(context, MemberNames.OrderDate.toString());
	}

	/**
	 * Set value of OrderDate
	 * @param orderdate
	 */
	public final void setOrderDate(java.util.Date orderdate)
	{
		setOrderDate(getContext(), orderdate);
	}

	/**
	 * Set value of OrderDate
	 * @param context
	 * @param orderdate
	 */
	public final void setOrderDate(com.mendix.systemwideinterfaces.core.IContext context, java.util.Date orderdate)
	{
		getMendixObject().setValue(context, MemberNames.OrderDate.toString(), orderdate);
	}

	/**
	 * @return value of Item
	 */
	public final java.lang.String getItem()
	{
		return getItem(getContext());
	}

	/**
	 * @param context
	 * @return value of Item
	 */
	public final java.lang.String getItem(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.Item.toString());
	}

	/**
	 * Set value of Item
	 * @param item
	 */
	public final void setItem(java.lang.String item)
	{
		setItem(getContext(), item);
	}

	/**
	 * Set value of Item
	 * @param context
	 * @param item
	 */
	public final void setItem(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String item)
	{
		getMendixObject().setValue(context, MemberNames.Item.toString(), item);
	}

	/**
	 * @return value of Quantity
	 */
	public final java.lang.Integer getQuantity()
	{
		return getQuantity(getContext());
	}

	/**
	 * @param context
	 * @return value of Quantity
	 */
	public final java.lang.Integer getQuantity(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.Integer) getMendixObject().getValue(context, MemberNames.Quantity.toString());
	}

	/**
	 * Set value of Quantity
	 * @param quantity
	 */
	public final void setQuantity(java.lang.Integer quantity)
	{
		setQuantity(getContext(), quantity);
	}

	/**
	 * Set value of Quantity
	 * @param context
	 * @param quantity
	 */
	public final void setQuantity(com.mendix.systemwideinterfaces.core.IContext context, java.lang.Integer quantity)
	{
		getMendixObject().setValue(context, MemberNames.Quantity.toString(), quantity);
	}

	/**
	 * @return value of Price
	 */
	public final java.math.BigDecimal getPrice()
	{
		return getPrice(getContext());
	}

	/**
	 * @param context
	 * @return value of Price
	 */
	public final java.math.BigDecimal getPrice(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.math.BigDecimal) getMendixObject().getValue(context, MemberNames.Price.toString());
	}

	/**
	 * Set value of Price
	 * @param price
	 */
	public final void setPrice(java.math.BigDecimal price)
	{
		setPrice(getContext(), price);
	}

	/**
	 * Set value of Price
	 * @param context
	 * @param price
	 */
	public final void setPrice(com.mendix.systemwideinterfaces.core.IContext context, java.math.BigDecimal price)
	{
		getMendixObject().setValue(context, MemberNames.Price.toString(), price);
	}

	/**
	 * @return value of TotalSaleAmount
	 */
	public final java.math.BigDecimal getTotalSaleAmount()
	{
		return getTotalSaleAmount(getContext());
	}

	/**
	 * @param context
	 * @return value of TotalSaleAmount
	 */
	public final java.math.BigDecimal getTotalSaleAmount(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.math.BigDecimal) getMendixObject().getValue(context, MemberNames.TotalSaleAmount.toString());
	}

	/**
	 * Set value of TotalSaleAmount
	 * @param totalsaleamount
	 */
	public final void setTotalSaleAmount(java.math.BigDecimal totalsaleamount)
	{
		setTotalSaleAmount(getContext(), totalsaleamount);
	}

	/**
	 * Set value of TotalSaleAmount
	 * @param context
	 * @param totalsaleamount
	 */
	public final void setTotalSaleAmount(com.mendix.systemwideinterfaces.core.IContext context, java.math.BigDecimal totalsaleamount)
	{
		getMendixObject().setValue(context, MemberNames.TotalSaleAmount.toString(), totalsaleamount);
	}

	/**
	 * @return value of SalesOrderImportRow_SalesOrderImport
	 */
	public final testpivottablewebwidget.proxies.SalesOrderImport getSalesOrderImportRow_SalesOrderImport() throws com.mendix.core.CoreException
	{
		return getSalesOrderImportRow_SalesOrderImport(getContext());
	}

	/**
	 * @param context
	 * @return value of SalesOrderImportRow_SalesOrderImport
	 */
	public final testpivottablewebwidget.proxies.SalesOrderImport getSalesOrderImportRow_SalesOrderImport(com.mendix.systemwideinterfaces.core.IContext context) throws com.mendix.core.CoreException
	{
		testpivottablewebwidget.proxies.SalesOrderImport result = null;
		com.mendix.systemwideinterfaces.core.IMendixIdentifier identifier = getMendixObject().getValue(context, MemberNames.SalesOrderImportRow_SalesOrderImport.toString());
		if (identifier != null)
			result = testpivottablewebwidget.proxies.SalesOrderImport.load(context, identifier);
		return result;
	}

	/**
	 * Set value of SalesOrderImportRow_SalesOrderImport
	 * @param salesorderimportrow_salesorderimport
	 */
	public final void setSalesOrderImportRow_SalesOrderImport(testpivottablewebwidget.proxies.SalesOrderImport salesorderimportrow_salesorderimport)
	{
		setSalesOrderImportRow_SalesOrderImport(getContext(), salesorderimportrow_salesorderimport);
	}

	/**
	 * Set value of SalesOrderImportRow_SalesOrderImport
	 * @param context
	 * @param salesorderimportrow_salesorderimport
	 */
	public final void setSalesOrderImportRow_SalesOrderImport(com.mendix.systemwideinterfaces.core.IContext context, testpivottablewebwidget.proxies.SalesOrderImport salesorderimportrow_salesorderimport)
	{
		if (salesorderimportrow_salesorderimport == null)
			getMendixObject().setValue(context, MemberNames.SalesOrderImportRow_SalesOrderImport.toString(), null);
		else
			getMendixObject().setValue(context, MemberNames.SalesOrderImportRow_SalesOrderImport.toString(), salesorderimportrow_salesorderimport.getMendixObject().getId());
	}

	/**
	 * @return the IMendixObject instance of this proxy for use in the Core interface.
	 */
	public final com.mendix.systemwideinterfaces.core.IMendixObject getMendixObject()
	{
		return salesOrderImportRowMendixObject;
	}

	/**
	 * @return the IContext instance of this proxy, or null if no IContext instance was specified at initialization.
	 */
	public final com.mendix.systemwideinterfaces.core.IContext getContext()
	{
		return context;
	}

	@java.lang.Override
	public boolean equals(Object obj)
	{
		if (obj == this)
			return true;

		if (obj != null && getClass().equals(obj.getClass()))
		{
			final testpivottablewebwidget.proxies.SalesOrderImportRow that = (testpivottablewebwidget.proxies.SalesOrderImportRow) obj;
			return getMendixObject().equals(that.getMendixObject());
		}
		return false;
	}

	@java.lang.Override
	public int hashCode()
	{
		return getMendixObject().hashCode();
	}

	/**
	 * @return String name of this class
	 */
	public static java.lang.String getType()
	{
		return "TestPivotTableWebWidget.SalesOrderImportRow";
	}

	/**
	 * @return String GUID from this object, format: ID_0000000000
	 * @deprecated Use getMendixObject().getId().toLong() to get a unique identifier for this object.
	 */
	@java.lang.Deprecated
	public java.lang.String getGUID()
	{
		return "ID_" + getMendixObject().getId().toLong();
	}
}